import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Plus, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full bg-base-100 px-4 pt-2 pb-4 border-t border-base-300 shadow-sm text-base-content">
      {imagePreview && (
        <div className="mb-2">
          <div className="relative w-fit">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-base-100 rounded-full border border-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="w-4 h-4 text-base-content/70" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 bg-base-200 px-4 py-2 rounded-full shadow-sm"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 bg-base-100 border border-base-300 rounded-full flex items-center justify-center text-base-content/70 hover:bg-base-300"
        >
          <Plus size={18} />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-base-content/50"
        />

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="text-primary hover:text-primary-focus disabled:opacity-50"
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
