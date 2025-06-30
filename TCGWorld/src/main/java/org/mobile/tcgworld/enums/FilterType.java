package org.mobile.tcgworld.enums;

import lombok.Getter;

@Getter
public enum FilterType {
    ByLike("根据热度"),
    ByCreateTime("根据创建时间");
    private final String description;
    FilterType(String description) {
        this.description=description;
    }
}
