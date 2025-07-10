package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.dto.CommentDTO;
import org.mobile.tcgworld.entity.Comment;
import org.mobile.tcgworld.enums.FilterType;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CommentService {
    List<CommentDTO> findAllCommentsByPostID(Long postID, int pageNumber, int pageSize, FilterType filterType);

    Optional<Comment> createComment(Comment comment);

    List<CommentDTO> fillCommentDTO(List<Comment> comments);
}
