package org.mobile.tcgworld.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "post_id")
    private Long postID;
    @Column(name ="parent_id")
    private Long parentID;
    @Column(name = "user_id")
    private Long userID;
    @Column(name = "content",columnDefinition = "TEXT")
    private String content;
    @Column(name = "likes")
    private Integer like;
    @Column(name = "create_time")
    private LocalDateTime createTime;
}
