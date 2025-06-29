package org.mobile.tcgworld.entity;

import lombok.Data;
import org.mobile.tcgworld.dto.PostDTO;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "posts")
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userID;
    @Column(length = 100)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
    @Column(name = "likes")
    private Integer like;
    public Post(PostDTO dto){
      userID= dto.getUserID();
      title = dto.getTitle();
      content = dto.getContent();
      createdTime = LocalDateTime.now();
      setIsDeleted(false);
      like = 0;
    }

    public Post() {

    }
}
