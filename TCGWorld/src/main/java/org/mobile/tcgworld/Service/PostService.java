package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.dto.PostDTO;
import org.mobile.tcgworld.entity.Post;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface PostService {
    Post createPost(PostDTO dto);
    PostDTO getPostById(Long id,Long userID);
    List<PostDTO> getAllPosts(int pageNumber, int pageSize,Long userID);
    List<Post> getPostsByUserId(Long userId);
    void deletePost(Long id);

    String getRedisKey(Long postId);

    void like(Long userId, Long postId);

    void unlike(Long userId, Long postId);

    boolean hasLiked(Long userId, Long postId);

    long likeCount(Long postId);

    List<Long> getLikedPostIds(Long userId);
}