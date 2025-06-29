package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findAllByPostID(Long postID);
}
