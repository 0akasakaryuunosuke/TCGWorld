package org.mobile.tcgworld.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "post_images")
@Data
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name="post_id")
    private Long postID;

}
