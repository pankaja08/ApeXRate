import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import java.util.HashMap;
import java.util.Map;

public class TestScrapers {
    public static void main(String[] args) {
        Map<String, String> urls = new HashMap<>();
        urls.put("BOC", "https://boc.lk/index.php?route=information/international_banking");
        urls.put("Commercial", "https://www.combank.lk/rates-tariff/exchange-rates");
        urls.put("Sampath", "https://www.sampath.lk/en/interest-exchange-rates");
        urls.put("HNB", "https://www.hnb.net/exchange-rates");
        urls.put("Seylan", "https://www.seylan.lk/exchange-rates");

        for (Map.Entry<String, String> entry : urls.entrySet()) {
            try {
                System.out.println("Testing " + entry.getKey() + "...");
                Document doc = Jsoup.connect(entry.getValue())
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .timeout(10000)
                        .get();
                System.out.println("SUCCESS: " + entry.getKey() + " - Title: " + doc.title());
                if (doc.text().contains("USD") || doc.text().contains("US Dollar")) {
                    System.out.println("  -> Found USD in text.");
                } else {
                    System.out.println("  -> Did NOT find USD in text.");
                }
            } catch (Exception e) {
                System.out.println("FAILED: " + entry.getKey() + " - " + e.getMessage());
            }
        }
    }
}
