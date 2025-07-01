package org.mobile.tcgworld.dto;


import lombok.Data;
import org.mobile.tcgworld.entity.Comment;
import org.springframework.beans.BeanUtils;
import java.time.LocalDateTime;
@Data
public class CommentDTO {
    private Long id;
    private Long postID;
    private Long parentID;
    private Long userID;
    private String content;
    private Integer like;
    private LocalDateTime createTime;
    private String userName;
    private String displayTime;
    public CommentDTO(Comment comment){
        BeanUtils.copyProperties(comment, this);
    }
    public CommentDTO(){}
}
