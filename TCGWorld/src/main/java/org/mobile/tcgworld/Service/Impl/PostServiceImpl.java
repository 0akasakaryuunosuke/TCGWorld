package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.PostService;
import org.mobile.tcgworld.dao.PostImageRepository;
import org.mobile.tcgworld.dao.UserRepository;
import org.mobile.tcgworld.dto.PostDTO;
import org.mobile.tcgworld.entity.Post;


import java.util.*;

import org.mobile.tcgworld.entity.PostImage;
import org.mobile.tcgworld.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.mobile.tcgworld.dao.PostRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private PostImageRepository postImageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Override
    public Post createPost(PostDTO dto) {
        Post post =new Post(dto);
        post=postRepository.save(post);
        List<String> urls =dto.getImageUrls();
        for (String url: urls
             ) {
            PostImage postImage= new PostImage();
            postImage.setPostID(post.getId());
            postImage.setImageUrl(url);
            postImageRepository.save(postImage);
        }
        return post;
    }

    @Override
    public PostDTO getPostById(Long id) {
        Optional<Post> post= postRepository.findById(id)
                .filter(p -> !p.getIsDeleted());
        if(post.isEmpty())
            return new PostDTO();
        PostDTO dto =new PostDTO();
        dto.fillDTO(post.get());
        dto.setUserName(userRepository.findById(dto.getUserID())
                .map(User::getUsername)
                .orElse(""));
        dto.setImageUrls( postImageRepository
                .findAllByPostID(dto.getId())
                .stream()
                .map(PostImage::getImageUrl)
                .collect(Collectors.toList()));
        return dto;
    }

    @Override
    public List<PostDTO> getAllPosts(int pageNumber, int pageSize ,Long userID) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Post> posts =postRepository.findPostsByIsDeletedFalseOrderByCreatedTimeDesc(pageable);
        List<PostDTO>dtos=new ArrayList<>();
        for (Post post:posts
             ) {
            PostDTO dto =new PostDTO();
            dto.fillDTO(post);
            dto.setUserName(userRepository.findById(post.getUserID())
                    .map(User::getUsername)
                    .orElse(""));
            dto.setImageUrls( postImageRepository
                    .findAllByPostID(post.getId())
                    .stream()
                    .map(PostImage::getImageUrl)
                    .collect(Collectors.toList()));
            dtos.add(dto);
            if(userID==0)
                dto.setIsLiked(false);
            else
                dto.setIsLiked(hasLiked(userID,dto.getId()));
        }
        return dtos;
    }

    @Override
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findPostsByUserIDAndIsDeletedFalseOrderByCreatedTimeDesc(userId);
    }

    @Override
    public void deletePost(Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        optionalPost.ifPresent(post -> {
            post.setIsDeleted(true);
            postRepository.save(post);
        });
    }

    @Override
    public String getRedisKey(Long postId) {
        return "post:like:" + postId;
    }
    @Override
    public void like(Long userId, Long postId) {
        Optional<Post> post= postRepository.findById(postId);
        if(post.isEmpty())
            throw new RuntimeException("帖子不见了");
        redisTemplate.opsForSet().add("post:like:" + postId, userId.toString());
        redisTemplate.opsForSet().add("user:like:" + userId, postId.toString());
        redisTemplate.opsForSet().add("post:like:changed", postId.toString());
        System.out.println("---------喜欢了"+likeCount(postId));
    }
    @Override
    public void unlike(Long userId, Long postId) {
        Optional<Post> post= postRepository.findById(postId);
        if(post.isEmpty()) {
            throw new RuntimeException("帖子不见了");
        }
        redisTemplate.opsForSet().remove("post:like:" + postId, userId.toString());
        redisTemplate.opsForSet().remove("user:like:" + userId, postId.toString());
        redisTemplate.opsForSet().add("post:like:changed", postId.toString());
        System.out.println("---------不喜欢了"+likeCount(postId));
    }
    @Override
    public boolean hasLiked(Long userId, Long postId) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(getRedisKey(postId), userId.toString()));
    }
    @Override
    public long likeCount(Long postId) {
        return redisTemplate.opsForSet().size(getRedisKey(postId));
    }
    @Override
    public List<Long> getLikedPostIds(Long userId) {
        Set<String> postIds = redisTemplate.opsForSet().members("user:like:" + userId);
        if (postIds != null) {
            return postIds.stream().map(Long::valueOf).collect(Collectors.toList());
        }
        else return new ArrayList<>();
    }

    @Scheduled(fixedRate = 3000)
    private void syncLikesToDatabase(){
        Set<String> changedPostIds = redisTemplate.opsForSet().members("post:like:changed");
        if (changedPostIds == null || changedPostIds.isEmpty()) return;
        for (String postIdStr : changedPostIds) {
            Long postId = Long.valueOf(postIdStr);
            Set<String> userIds = redisTemplate.opsForSet().members("post:like:" + postId);
            Optional<Post> post =postRepository.findById(postId);
            post.ifPresent(value -> {
                if (userIds != null) {
                    value.setLike(userIds.size());
                    postRepository.save(post.get());
                }
            });
            redisTemplate.opsForSet().remove("post:like:changed", postIdStr);
        }
    }
}