import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Car,
  X,
  Diamond,
  Lightbulb,
  ShoppingBasket,
  Smile,
} from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";

interface EmojiInputPopupProps {
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  commentTextRef: React.RefObject<HTMLInputElement>;
}
type EmojiData = {
  emoji: string;
  keywords: string[];
};

const EmojiInputPopup: React.FC<EmojiInputPopupProps> = ({
  setCommentText,
  commentTextRef,
}) => {
  const emojiCategories: Record<string, EmojiData[]> = {
    people: [
      { emoji: "😀", keywords: ["grinning", "happy", "smile", "joy"] },
      { emoji: "😃", keywords: ["happy", "joy", "smile", "grin", "smiley"] },
      { emoji: "😄", keywords: ["happy", "joy", "laugh", "pleased"] },
      { emoji: "😁", keywords: ["happy", "joy", "grin", "beaming"] },
      { emoji: "😅", keywords: ["happy", "sweat", "nervous", "laugh"] },
      { emoji: "😂", keywords: ["joy", "tears", "laugh", "lol", "laughing"] },
      {
        emoji: "🤣",
        keywords: ["rolling", "floor", "laughing", "lol", "rofl"],
      },
      { emoji: "😊", keywords: ["happy", "smile", "blush", "sweet", "shy"] },
      { emoji: "😇", keywords: ["innocent", "angel", "halo", "blessed"] },
      { emoji: "🙂", keywords: ["slight", "smile", "happy", "content"] },
      { emoji: "😉", keywords: ["wink", "flirt", "joke", "humor"] },
      { emoji: "😌", keywords: ["relieved", "content", "calm", "peaceful"] },
      { emoji: "😍", keywords: ["love", "heart", "eyes", "adore", "crush"] },
      { emoji: "🥰", keywords: ["love", "hearts", "affection", "adore"] },
      { emoji: "😘", keywords: ["kiss", "love", "affection", "blowing kiss"] },
      { emoji: "😋", keywords: ["yum", "tongue", "tasty", "delicious"] },
      { emoji: "😎", keywords: ["cool", "sunglasses", "awesome", "rad"] },
      { emoji: "🤩", keywords: ["star struck", "excited", "amazed", "wow"] },
      { emoji: "🥳", keywords: ["party", "celebration", "woohoo", "festive"] },
      { emoji: "😏", keywords: ["smirk", "smug", "flirt", "suspicious"] },
      { emoji: "😒", keywords: ["unamused", "annoyed", "side eye", "meh"] },
      { emoji: "😞", keywords: ["sad", "disappointed", "unhappy", "down"] },
      { emoji: "😔", keywords: ["sad", "pensive", "disappointed", "upset"] },
      { emoji: "😟", keywords: ["worried", "concerned", "anxious", "nervous"] },
    ],
    activities: [
      { emoji: "⚽", keywords: ["soccer", "football", "sport", "ball"] },
      { emoji: "🏀", keywords: ["basketball", "sport", "ball", "hoops"] },
      { emoji: "🏈", keywords: ["football", "american", "sport", "nfl"] },
      { emoji: "⚾", keywords: ["baseball", "sport", "ball"] },
      { emoji: "🎾", keywords: ["tennis", "sport", "ball", "racket"] },
      { emoji: "🏐", keywords: ["volleyball", "sport", "ball"] },
      { emoji: "🎱", keywords: ["pool", "billiards", "8 ball", "game"] },
    ],
    travel: [
      { emoji: "🚗", keywords: ["car", "automobile", "vehicle", "red car"] },
      { emoji: "🚕", keywords: ["taxi", "cab", "vehicle", "transport"] },
      { emoji: "🚙", keywords: ["suv", "car", "vehicle", "automobile"] },
      { emoji: "🚌", keywords: ["bus", "vehicle", "transport", "school"] },
      { emoji: "🚎", keywords: ["trolley", "bus", "tram", "transport"] },
      { emoji: "🏎️", keywords: ["racing", "car", "fast", "formula one"] },
    ],
    objects: [
      { emoji: "💡", keywords: ["light bulb", "idea", "bright", "smart"] },
      { emoji: "📱", keywords: ["phone", "mobile", "cell", "device"] },
      { emoji: "💻", keywords: ["laptop", "computer", "mac", "device"] },
      { emoji: "⌨️", keywords: ["keyboard", "typing", "computer", "input"] },
      { emoji: "🖥️", keywords: ["desktop", "computer", "monitor", "screen"] },
    ],
    symbols: [
      { emoji: "❤️", keywords: ["heart", "love", "red", "romance"] },
      { emoji: "🧡", keywords: ["heart", "love", "orange", "affection"] },
      { emoji: "💛", keywords: ["heart", "love", "yellow", "friendship"] },
      { emoji: "💚", keywords: ["heart", "love", "green", "nature"] },
      { emoji: "💙", keywords: ["heart", "love", "blue", "trust"] },
    ],
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);

  const [searchEmoji, setSearchEmoji] = useState("");
  const [currentCategory, setCurrentCategory] = useState("people");
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(0);

  const filteredEmojis = useMemo(() => {
    if (!searchEmoji)
      return emojiCategories[currentCategory as keyof typeof emojiCategories];
    const searchTerm = searchEmoji.toLowerCase();
    return Object.values(emojiCategories)
      .flat()
      .filter(
        (emojiData) =>
          emojiData.emoji.includes(searchTerm) ||
          emojiData.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          )
      );
  }, [searchEmoji, currentCategory]);

  const insertEmoji = (emoji: string) => {
    setCommentText((prevValue) => prevValue + emoji);

    if (commentTextRef.current) {
      commentTextRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const gridCols = 8;
    const currentRow = Math.floor(selectedEmojiIndex / gridCols);
    // const currentCol = selectedEmojiIndex % gridCols;
    const totalRows = Math.ceil(filteredEmojis.length / gridCols);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (selectedEmojiIndex < filteredEmojis.length - 1) {
          setSelectedEmojiIndex((prev) => prev + 1);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (selectedEmojiIndex > 0) {
          setSelectedEmojiIndex((prev) => prev - 1);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentRow > 0) {
          const newIndex = selectedEmojiIndex - gridCols;
          if (newIndex >= 0) {
            setSelectedEmojiIndex(newIndex);
          }
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currentRow < totalRows - 1) {
          const newIndex = selectedEmojiIndex + gridCols;
          if (newIndex < filteredEmojis.length) {
            setSelectedEmojiIndex(newIndex);
          }
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (filteredEmojis[selectedEmojiIndex]) {
          insertEmoji(filteredEmojis[selectedEmojiIndex].emoji);
        }
        break;
      case "Tab":
        if (!e.shiftKey && document.activeElement === searchInputRef.current) {
          e.preventDefault();
          emojiGridRef.current?.focus();
        }
        break;
    }
  };

  // Scroll selected emoji into view
  useEffect(() => {
    const selectedElement = document.querySelector(
      `[data-index="${selectedEmojiIndex}"]`
    ) as HTMLElement;
    if (selectedElement && emojiGridRef.current) {
      selectedElement.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedEmojiIndex]);

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmoji(e.target.value);
    setSelectedEmojiIndex(0);
  };
  const onSearchTextClear = () => {
    setSearchEmoji("");
    setSelectedEmojiIndex(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px]" align="start">
        <div className="space-y-4">
          <div className="flex items-center relative">
            <Input
              ref={searchInputRef}
              placeholder="Search emoji (e.g., happy, love, sport)"
              value={searchEmoji}
              onChange={onSearchTextChange}
              className="w-full p-2"
              onKeyDown={handleKeyDown}
            />
            <div
              className="p-1 rounded-full absolute right-2 hover:bg-secondary cursor-pointer"
              onClick={onSearchTextClear}
            >
              <X className="h-4 w-4" />
            </div>
          </div>
          <Tabs defaultValue="people" onValueChange={setCurrentCategory}>
            <TabsList className="grid grid-cols-8 h-auto p-1">
              <TabsTrigger value="people" className="p-2">
                <Smile className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="activities" className="p-2">
                <ShoppingBasket className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="travel" className="p-2">
                <Car className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="objects" className="p-2">
                <Lightbulb className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="symbols" className="p-2">
                <Diamond className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div
            className="grid grid-cols-8 gap-1 p-2 overflow-y-auto"
            ref={emojiGridRef}
          >
            {filteredEmojis.map((emojiData, index) => (
              <Button
                key={emojiData.emoji}
                data-index={index}
                variant="ghost"
                className={`h-8 w-8 p-0 hover:bg-muted group relative ${
                  selectedEmojiIndex === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => insertEmoji(emojiData.emoji)}
                onMouseEnter={() => setSelectedEmojiIndex(index)}
                role="gridcell"
                aria-selected={selectedEmojiIndex === index}
                tabIndex={-1}
                title={emojiData.keywords.join(", ")}
              >
                {emojiData.emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiInputPopup;
