package com.apexrate;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.FileWriter;
import java.io.IOException;

public class ScrapeDump {
    public static void main(String[] args) {
        dump("boc", "https://boc.lk/index.php?route=information/international_banking");
        dump("sampath", "https://www.sampath.lk/en/interest-exchange-rates");
        dump("seylan", "https://www.seylan.lk/exchange-rates");
        dump("hnb", "https://www.hnb.net/exchange-rates");
        dump("combank", "https://www.combank.lk/rates-tariff/exchange-rates");
    }

    private static void dump(String name, String url) {
        try {
            System.out.println("Fetching " + name + "...");
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5")
                    .header("Connection", "keep-alive")
                    .timeout(20000)
                    .get();
            try (FileWriter fw = new FileWriter(name + ".html")) {
                fw.write(doc.html());
            }
            System.out.println("Success: " + name);
        } catch (Exception e) {
            System.out.println("Failed: " + name + " - " + e.getMessage());
        }
    }
}
