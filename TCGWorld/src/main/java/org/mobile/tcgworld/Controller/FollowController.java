package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.Service.FollowService;
import org.mobile.tcgworld.entity.Follow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tcgworld/follow")
public class FollowController {
    @Autowired
    private FollowService followService;

    @PostMapping("/doFollow")
    public Result doFollow(@RequestBody Follow follow){
        followService.follow(follow);
        return Result.success();
    }
    @DeleteMapping("/unfollow")
    public Result unfollow(@RequestParam Long userID,@RequestParam Long followerID){
        try {
            followService.unfollow(userID, followerID);
        }
        catch (Exception e){
            return Result.error(e.getMessage());
        }

        return Result.success();
    }

    @GetMapping("/isFollowing")
    public Result isFollowing(@RequestParam Long userID,
                              @RequestParam Long followerID){
        return Result.success(followService.isFollowed(userID, followerID));
    }

    @GetMapping("/getFollowPost/{userID}")
    public Result getFollowPost(@PathVariable String userID,
                                @RequestParam(defaultValue = "0") int pageNumber,
                                @RequestParam(defaultValue = "10") int pageSize){
        return Result.success(followService.getFollowPost(Long.valueOf(userID),pageNumber,pageSize));
    }
}
