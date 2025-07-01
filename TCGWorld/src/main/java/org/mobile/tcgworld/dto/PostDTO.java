package org.mobile.tcgworld.dto;

import lombok.Data;
import org.mobile.tcgworld.entity.Post;
import org.mobile.tcgworld.utils.MyUtil;
import org.springframework.beans.BeanUtils;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private Long userID;
    private String userName;
    private String title;
    private String content;
    private LocalDateTime createdTime;
    private List<String> imageUrls;
    private Integer like;
    private Boolean isLiked;
    private String displayTime;

    public void fillDTO(Post post){
        id=post.getId();
        userID=post.getUserID();
        title= post.getTitle();
        content= post.getContent();
        createdTime=post.getCreatedTime();
        like =post.getLike();
        displayTime= MyUtil.formatCommentTime(post.getCreatedTime());
    }
}
