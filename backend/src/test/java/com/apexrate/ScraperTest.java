import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ScraperTest {
    public static void main(String[] args) {
        try {
            System.out.println("Connecting to Amana Bank...");
            Document doc = Jsoup.connect("https://www.amanabank.lk/business/treasury/exchange-rates.html")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            System.out.println("Successfully fetched document. Parsing...");
            Elements tables = doc.select("table");
            for (Element table : tables) {
                Elements rows = table.select("tr");
                for (Element row : rows) {
                    Elements cols = row.select("td");
                    if (cols.size() >= 3 && cols.get(0).text().contains("US Dollar")) {
                        String buyStr = cols.get(1).text().replaceAll("[^0-9.]", "");
                        String sellStr = cols.get(2).text().replaceAll("[^0-9.]", "");
                        System.out.println("Buy: " + buyStr);
                        System.out.println("Sell: " + sellStr);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
