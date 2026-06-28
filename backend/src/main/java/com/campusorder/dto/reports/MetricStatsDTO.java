package com.campusorder.dto.reports;

public class MetricStatsDTO {

    private Double average;
    private Double minimum;
    private Double maximum;

    public MetricStatsDTO(Double average, Double minimum, Double maximum) {
        this.average = average;
        this.minimum = minimum;
        this.maximum = maximum;
    }

    public Double getAverage() {
        return average;
    }

    public Double getMinimum() {
        return minimum;
    }

    public Double getMaximum() {
        return maximum;
    }
}