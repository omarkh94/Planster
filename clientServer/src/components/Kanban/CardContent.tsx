import { Button } from "@/components/ui/button";
import { CardType } from "@/types";
import { Calendar, Clock, Edit2, MessageSquare, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import DescriptionEditor from "./DescriptionEditor";

const CardContent = ({
  card,
  onUpdateDescription,
}: {
  card: CardType;
  onUpdateDescription?: (newDescription: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(card.description || "");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [comment, setComment] = useState("");
  const handleSaveDescription = useCallback(() => {
    onUpdateDescription?.(description);
    setIsEditing(false);
  }, [description, onUpdateDescription]);

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    console.log("comment", comment);
    setIsAddingComment(false);
    setComment("");
  };

  const DescriptionDisplay = useCallback(
    () => (
      <div className="group relative">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit2 size={16} />
          </Button>
        </div>
        <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
          {description || "No description provided"}
        </div>
      </div>
    ),
    [description]
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{card.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Created {card?.createdAt?.toLocaleDateString()}</span>
          {card?.updatedAt && (
            <>
              <span>•</span>
              <span>Updated {card?.updatedAt?.toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            {isEditing ? (
              <DescriptionEditor
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                description={description}
                setDescription={setDescription}
                handleSaveDescription={handleSaveDescription}
                setIsEditing={setIsEditing}
              />
            ) : (
              <DescriptionDisplay />
            )}
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({card.comments.length})
              </h2>

              <button
                className="text-sm text-gray-500"
                onClick={() => setIsAddingComment(true)}
              >
                Add Comment
              </button>
            </div>
            <div className="space-y-4">
              {card.comments.map((comment, index) => (
                <div key={index} className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.commenter.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.description}</p>
                </div>
              ))}
              {card.comments.length === 0 && (
                <p className="text-gray-500 italic">No comments yet</p>
              )}
            </div>
            {isAddingComment && (
              <div ref={commentsRef} className="flex flex-col gap-2 w-full">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="text-sm text-gray-500 self-end"
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Meta information */}
        <div className="space-y-6">
          {/* Assignee */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Assignee</h2>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
              <span className="text-gray-900 font-medium">
                {card.assignee.name}
              </span>
            </div>
          </div>

          {/* Author */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Author</h2>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
              <span className="text-gray-900 font-medium">
                {card.author.name}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Activity</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  Created: {card?.createdAt?.toLocaleDateString()}
                </span>
              </div>
              {card?.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-gray-700">
                    Updated: {card?.updatedAt?.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardContent;
