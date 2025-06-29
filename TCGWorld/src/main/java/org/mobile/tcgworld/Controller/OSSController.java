package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Result;
import org.mobile.tcgworld.utils.OSSUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tcgworld/oss")
public class OSSController {

    @Autowired
    private OSSUtil ossUtil;

    @PostMapping("/upload")
    public Result upload(@RequestParam("file") MultipartFile file) {
        System.out.println("开始上传");
        String url = ossUtil.upload(file);
        Map<String, String> map = new HashMap<>();
        map.put("url", url);
        return Result.success(map);
    }
}