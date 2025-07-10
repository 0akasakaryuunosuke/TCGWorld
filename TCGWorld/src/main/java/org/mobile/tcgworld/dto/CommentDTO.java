package org.mobile.tcgworld.dto;


import lombok.Data;
import org.mobile.tcgworld.entity.Comment;
import org.springframework.beans.BeanUtils;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private List<CommentDTO> childrenComment;
    public CommentDTO(Comment comment){
        childrenComment =new ArrayList<>();
        BeanUtils.copyProperties(comment, this);
    }
    public CommentDTO(){
        childrenComment =new ArrayList<>();
    }
}
