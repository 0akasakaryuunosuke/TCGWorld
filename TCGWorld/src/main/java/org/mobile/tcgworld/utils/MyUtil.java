package org.mobile.tcgworld.utils;

import java.time.Duration;
import java.time.LocalDateTime;

public class MyUtil {
    public static String formatCommentTime(LocalDateTime createTime) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(createTime, now);

        long seconds = duration.getSeconds();
        long minutes = duration.toMinutes();
        long hours = duration.toHours();

        if (seconds < 60) {
            return "刚刚";
        } else if (minutes < 60) {
            return minutes + " 分钟前";
        } else if (hours < 24) {
            return hours + " 小时前";
        } else {
            return createTime.toLocalDate().toString();
        }
    }
}
