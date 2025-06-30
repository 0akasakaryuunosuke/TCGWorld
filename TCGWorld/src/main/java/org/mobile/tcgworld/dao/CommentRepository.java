package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Cart;
import org.mobile.tcgworld.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findCommentsByPostIDOrderByLikeDesc(Long postID, Pageable pageable);
    Page<Comment> findCommentsByPostIDOrderByCreateTimeDesc(Long postID,Pageable pageable);
}
