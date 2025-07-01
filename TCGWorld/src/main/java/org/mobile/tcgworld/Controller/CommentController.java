package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.CommentService;
import org.mobile.tcgworld.entity.Comment;
import org.mobile.tcgworld.enums.FilterType;
import org.mobile.tcgworld.enums.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tcgworld/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/createComment")
    public Result createComment(@RequestBody  Comment comment){
        Optional<Comment> res =commentService.createComment(comment);
        if(res.isEmpty()){
            return Result.error(ResultCodeEnum.COMMENT_FAIL);
        }
        else{
            return Result.success();
        }
    }
    @GetMapping("/getComment")
    public Result getComment(@RequestParam Long postID,
                             @RequestParam int pageNumber,
                             @RequestParam int pageSize,
                             @RequestParam(defaultValue = "ByLike")FilterType filterType
                             ){
      List<Comment>comments= commentService.findAllCommentsByPostID(postID,pageNumber,pageSize,filterType).getContent();
      return Result.success(commentService.fillCommentDTO(comments));
    }
}
