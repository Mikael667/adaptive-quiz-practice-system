package com.adaptivequiz.person4_analytics;

import java.util.*;
 
public class AnalyticsSystem {

    static class Topic {
        String name;
        int correct;
        int total;
        double accuracy;

        Topic(String name, int correct, int total) {
            this.name = name;
            this.correct = correct;
            this.total = total;
            calculateAccuracy();
        }

        void calculateAccuracy() {
            accuracy = total > 0
                    ? (correct * 100.0) / total
                    : 0;
        }

        String getLevel() {
            if (accuracy >= 80)
                return "Strong";
            else if (accuracy >= 50)
                return "Average";
            else
                return "Weak";
        }
    }

    static class Analytics {

        ArrayList<Topic> topics = new ArrayList<>();

        void addTopic(String name, int correct, int total) {
            if (total <= 0 || correct < 0 || correct > total) {
                System.out.println("Invalid quiz data!");
                return;
            }

            topics.add(new Topic(name, correct, total));
        }

        void analyzePerformance() {

            int totalCorrect = 0;
            int totalQuestions = 0;

            Topic weakest = null;

            System.out.println("\n===== STUDENT PERFORMANCE =====");

            for (Topic t : topics) {

                totalCorrect += t.correct;
                totalQuestions += t.total;

                System.out.println("\nTopic: " + t.name);
                System.out.printf("Accuracy: %.2f%%\n", t.accuracy);
                System.out.println("Level: " + t.getLevel());

                if (weakest == null ||
                    t.accuracy < weakest.accuracy) {
                    weakest = t;
                }
            }

            double overallAccuracy = totalQuestions > 0
                    ? (totalCorrect * 100.0) / totalQuestions
                    : 0;

            System.out.println("\n===== OVERALL ANALYSIS =====");

            System.out.println("Total Quizzes: " + topics.size());
            System.out.println("Correct Answers: " + totalCorrect);
            System.out.println("Total Questions: " + totalQuestions);

            System.out.printf("Overall Accuracy: %.2f%%\n",
                    overallAccuracy);

            if (weakest != null) {
                System.out.println("Weakest Topic: " + weakest.name);
            }

            generateRecommendations();
        }

        void generateRecommendations() {

            System.out.println("\n===== RECOMMENDATIONS =====");

            if (topics.isEmpty()) {
                System.out.println("Complete a quiz to receive recommendations.");
                return;
            }

            for (Topic t : topics) {

                if (t.accuracy < 50) {
                    System.out.println(
                        "Practice more questions on " + t.name
                    );
                }
                else if (t.accuracy < 80) {
                    System.out.println(
                        "Revise and improve " + t.name
                    );
                }
                else {
                    System.out.println(
                        "Excellent! Try advanced questions on " + t.name
                    );
                }
            }
        }
    }

    public static void main(String[] args) {

        Analytics student = new Analytics();

        student.addTopic("Variables", 9, 10);
        student.addTopic("Loops", 4, 10);
        student.addTopic("Arrays", 6, 10);
        student.addTopic("OOP", 8, 10);
        student.addTopic("Methods", 3, 10);

        student.analyzePerformance();
    }
}
