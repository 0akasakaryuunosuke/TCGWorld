package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.FollowService;
import org.mobile.tcgworld.Service.PostService;
import org.mobile.tcgworld.dao.FollowRepository;
import org.mobile.tcgworld.dao.PostRepository;
import org.mobile.tcgworld.dto.PostDTO;
import org.mobile.tcgworld.entity.Follow;
import org.mobile.tcgworld.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowServiceImpl implements FollowService {
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private PostService postService;
    @Override
    public void follow(Follow follow) {
        followRepository.save(follow);
    }
    @Override
    public void unfollow(Long id){
        followRepository.deleteById(id);
    }
    @Override
    public void unfollow(Long userID, Long followerID){
        Optional<Follow> follow =followRepository.findByUserIDAndFollowerID(userID,followerID);
      if(follow.isPresent()){
          followRepository.deleteById(follow.get().getId());
      }
      else {
          throw new RuntimeException("你还没有关注");
      }
    }
    @Override
    public boolean isFollowed(Long userID, Long followerID){
        Optional<Follow> follow =followRepository.findByUserIDAndFollowerID(userID,followerID);
        return follow.isPresent();
    }
    @Override
    public List<PostDTO>getFollowPost(Long userID,int pageNumber,int pageSize){
        Pageable pageable = PageRequest.of(pageNumber,pageSize);
        List<Post> posts= postRepository.findFollowedPosts(userID,pageable).getContent();
        return postService.toDTOs(posts,userID);
    }

}
