package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findPostsByIsDeletedFalseOrderByCreatedTimeDesc(Pageable pageable);
    List<Post> findPostsByUserIDAndIsDeletedFalseOrderByCreatedTimeDesc(Long userID);
    @Query("SELECT p FROM Post p WHERE p.userID IN (SELECT f.followerID FROM Follow f WHERE f.userID = :userID) ORDER BY p.createdTime DESC")
    Page<Post> findFollowedPosts(@Param("userID") Long userID, Pageable pageable);
}