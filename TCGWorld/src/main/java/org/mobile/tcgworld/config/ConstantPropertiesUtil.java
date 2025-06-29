package org.mobile.tcgworld.config;


import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ConstantPropertiesUtil implements InitializingBean {
    @Value("${alibaba.cloud.oss.endpoint}")
    private String endpoint;

    @Value("${alibaba.cloud.access-key}")
    private String keyId;

    @Value("${alibaba.cloud.secret-key}")
    private String keySecret;

    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    public static String END_POINT;

    public static String KEY_ID;

    public static String KEY_SECRET;

    public static String BUCKET_NAME;

    @Override
    public void afterPropertiesSet() throws Exception {
        END_POINT = endpoint;

        KEY_ID = keyId;

        KEY_SECRET = keySecret;

        BUCKET_NAME = bucketName;
    }
}
