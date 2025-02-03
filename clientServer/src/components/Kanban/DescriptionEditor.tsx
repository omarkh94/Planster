import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Eye, Save } from "lucide-react";

const DescriptionEditor = ({
  activeTab,
  setActiveTab,
  setDescription,
  handleSaveDescription,
  description,
  setIsEditing,
}: {
  activeTab: "write" | "preview";
  setActiveTab: (tab: "write" | "preview") => void;
  description: string;
  setDescription: (description: string) => void;
  handleSaveDescription: () => void;
  setIsEditing: (isEditing: boolean) => void;
}) => (
  <div className="space-y-4">
    <Tabs
      defaultValue={activeTab}
      onValueChange={(value) => setActiveTab(value as "write" | "preview")}
    >
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="write" className="flex items-center gap-2">
            <Edit2 size={16} />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye size={16} />
            Preview
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDescription(description || "");
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveDescription}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
        </div>
      </div>

      <TabsContent value="write" className="mt-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
          placeholder="Write your description here... Markdown is supported"
        />
        <p className="text-sm text-gray-500 mt-2">
          Supports Markdown formatting: **bold**, *italic*, [links](url), etc.
        </p>
      </TabsContent>

      <TabsContent value="preview" className="mt-2">
        <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none">
          {description}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default DescriptionEditor;
