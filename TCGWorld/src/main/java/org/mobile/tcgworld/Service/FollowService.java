package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.dto.PostDTO;
import org.mobile.tcgworld.entity.Follow;
import org.springframework.stereotype.Service;

import java.util.List;


public interface FollowService {
    void follow(Follow follow);

    void unfollow(Long id);

    void unfollow(Long userID, Long followerID);

    boolean isFollowed(Long userID, Long followerID);

    List<PostDTO> getFollowPost(Long userID, int pageNumber, int pageSize);
}
