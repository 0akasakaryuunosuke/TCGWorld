package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.CommentService;
import org.mobile.tcgworld.Service.UserService;
import org.mobile.tcgworld.dao.CommentRepository;
import org.mobile.tcgworld.dto.CommentDTO;
import org.mobile.tcgworld.entity.Comment;
import org.mobile.tcgworld.entity.User;
import org.mobile.tcgworld.enums.FilterType;
import org.mobile.tcgworld.utils.MyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;




@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserService userService;

    @Override
    public List<CommentDTO> findAllCommentsByPostID(Long postID, int pageNumber, int pageSize, FilterType filterType){
        Pageable pageable = PageRequest.of(pageNumber,pageSize);
        List<CommentDTO>result ;
        if(filterType.equals(FilterType.ByLike)){
          result =fillCommentDTO(commentRepository.findCommentsByPostIDAndParentIDIsNullOrderByLikeDesc(postID,pageable).getContent());
        }
        else{
            result =fillCommentDTO(commentRepository.findCommentsByPostIDAndParentIDIsNullOrderByCreateTimeDesc(postID,pageable).getContent());
        }
        getChildren(result);
        return result;
    }

    @Override
    public Optional<Comment> createComment(Comment comment){
        comment.setCreateTime(LocalDateTime.now());
        comment.setLike(0);
       return Optional.of(commentRepository.save(comment));
    }
    @Override
    public List<CommentDTO> fillCommentDTO(List<Comment> comments){
        List<CommentDTO>result =new ArrayList<>();
        for (Comment comment:comments
             ) {
            CommentDTO dto =new CommentDTO(comment);
            String userName= userService.getUserById(dto.getUserID()).map(User::getUsername).orElse("匿名");
            dto.setUserName(userName);
            dto.setDisplayTime(MyUtil.formatCommentTime(dto.getCreateTime()));
            result.add(dto);
        }
        return result;
    }

    private void getChildren(List<CommentDTO> commentDTOs){

        for (CommentDTO dto:commentDTOs
             ) {
            if(dto.getChildrenComment().isEmpty()){
              dto.setChildrenComment(fillCommentDTO(commentRepository.
                             //findTop3ByParentIDOrderByCreateTimeDesc(dto.getId())));
                              findCommentsByParentIDOrderByCreateTimeDesc(dto.getId())));
            }
        }
    }
}
