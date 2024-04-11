package main

import (
	"fmt"
	"log"
	"net/http"

	gt "github.com/bas24/googletranslatefree"
	"github.com/gorilla/websocket"
)

func main() {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/websoc", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		fmt.Printf("Method: %s\n", r.Method)
		fmt.Printf("URL: %s\n", r.URL)
		fmt.Printf("Headers: %s\n", r.Header)

		if err != nil {
			log.Print("upgrade:", err)
		}
		defer conn.Close()

		_, text, err := conn.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			return
		}

		inputText := string(text)

		languageCodes := map[string]string{
			"English":    "en",
			"Spanish":    "es",
			"French":     "fr",
			"German":     "de",
			"Italian":    "it",
			"Chinese":    "zh",
			"Japanese":   "ja",
			"Korean":     "ko",
			"Russian":    "ru",
			"Arabic":     "ar",
			"Portuguese": "pt",
			"Dutch":      "nl",
			"Swedish":    "sv",
			"Norwegian":  "no",
			"Danish":     "da",
			"Finnish":    "fi",
			"Polish":     "pl",
			"Turkish":    "tr",
			"Greek":      "el",
			"Czech":      "cs",
			"Hungarian":  "hu",
			"Thai":       "th",
			"Hebrew":     "he",
			"Hindi":      "hi",
			"Bengali":    "bn",
			"Vietnamese": "vi",
			"Malay":      "ms",
			"Indonesian": "id",
			"Filipino":   "fil",
			"Ukrainian":  "uk",
		}

		translatedTexts := make(chan string, len(languageCodes))

		for language, code := range languageCodes {
			go func(language, code string) {
				translation, _ := gt.Translate(inputText, "auto", code)
				translatedTexts <- fmt.Sprintf("%s: %s", language, translation)
			}(language, code)
		}

		for i := 0; i < len(languageCodes); i++ {
			translatedText := <-translatedTexts
			conn.WriteMessage(websocket.TextMessage, []byte(translatedText))
		}
	})

	fmt.Println("server running on port 8050")
	log.Fatal(http.ListenAndServe(":8050", nil))
}
