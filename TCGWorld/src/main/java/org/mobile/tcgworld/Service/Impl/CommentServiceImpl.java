package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.CommentService;
import org.mobile.tcgworld.dao.CommentRepository;
import org.mobile.tcgworld.entity.Comment;
import org.mobile.tcgworld.enums.FilterType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class CommentServiceImpl implements CommentService {
    @Autowired private CommentRepository commentRepository;

    @Override
    public Page<Comment> findAllCommentsByPostID(Long postID, int pageNumber, int pageSize, FilterType filterType){
        Pageable pageable = PageRequest.of(pageNumber,pageSize);
        if(filterType.equals(FilterType.ByLike)){
            return commentRepository.findCommentsByPostIDOrderByLikeDesc(postID,pageable);
        }
        else{
            return commentRepository.findCommentsByPostIDOrderByCreateTimeDesc(postID,pageable);
        }
    }

    @Override
    public Optional<Comment> createComment(Comment comment){
        comment.setCreateTime(LocalDateTime.now());
       return Optional.of(commentRepository.save(comment));
    }

}
