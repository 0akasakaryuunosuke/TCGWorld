package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.PostService;
import org.mobile.tcgworld.dto.PostDTO;
import org.mobile.tcgworld.entity.Post;
import org.mobile.tcgworld.enums.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tcgworld/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/createPost")
    public Result createPost(@RequestBody PostDTO dto) {
        return Result.success(postService.createPost(dto));
    }

    @GetMapping("/getPost/{id}")
    public Result getPost(@PathVariable String id) {
       PostDTO dto= postService.getPostById(Long.valueOf(id));
       if (!dto.getId().equals(Long.valueOf(id)))
           return Result.error(ResultCodeEnum.POST_NOT_FIND);
       else{
           return Result.success(dto);
       }
    }

    @GetMapping("/getAllPosts")
    public Result getAllPosts(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam Long userID
    ) {
        List<PostDTO> result=postService.getAllPosts(pageNumber,pageSize,userID);
        System.out.println(result);
        return Result.success(result);
    }

    @GetMapping("/getByUserID/{userId}")
    public Result getPostsByUser(@PathVariable String userId) {
        return Result.success(postService.getPostsByUserId(Long.valueOf(userId)));
    }

    @DeleteMapping("/delete/{id}")
    public Result deletePost(@PathVariable String id) {
        postService.deletePost(Long.valueOf(id));
        return Result.success("删除成功");
    }

    @PutMapping("/like")
    public Result handleLike(@RequestParam Long userID,
                             @RequestParam Long postID){
        try{
            postService.like(userID,postID);
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/unlike")
    public Result handleUnlike(@RequestParam Long userID,
                               @RequestParam Long postID){
        try{
            postService.unlike(userID,postID);
            return Result.success();
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }
    }
}