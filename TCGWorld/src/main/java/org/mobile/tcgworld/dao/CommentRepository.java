package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findCommentsByPostIDOrderByLikeDesc(Long postID, Pageable pageable);
    Page<Comment> findCommentsByPostIDOrderByCreateTimeDesc(Long postID,Pageable pageable);

    Page<Comment> findCommentsByPostIDAndParentIDIsNullOrderByCreateTimeDesc(Long postID,Pageable pageable);
    Page<Comment> findCommentsByPostIDAndParentIDIsNullOrderByLikeDesc(Long postID,Pageable pageable);

    List<Comment> findTop3ByParentIDOrderByCreateTimeDesc(Long parentID);

    List<Comment> findCommentsByParentIDOrderByCreateTimeDesc(Long parentID);

}
