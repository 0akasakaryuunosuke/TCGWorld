package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findPostsByIsDeletedFalseOrderByCreatedTimeDesc(Pageable pageable);
    List<Post> findPostsByUserIDAndIsDeletedFalseOrderByCreatedTimeDesc(Long userID);
}