package org.mobile.tcgworld.utils;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
public class OSSUtil {

    @Value("${alibaba.cloud.oss.endpoint}")
    private String endpoint;
    @Value("${alibaba.cloud.access-key}")
    private String accessKeyId;
    @Value("${alibaba.cloud.secret-key}")
    private String accessKeySecret;
    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    public String upload(MultipartFile file) {
        String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try  {
            ossClient.putObject(bucketName, filename, file.getInputStream());
            return "https://" + bucketName + "." + endpoint + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("上传失败", e);
        }
    }
}