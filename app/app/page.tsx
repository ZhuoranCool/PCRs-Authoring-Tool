import { DescriptionBlock } from "@/components/description";
import { SourceCode } from "@/components/sourceCode";
import { TestSpace } from "@/components/test";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid gap-4">
        <DescriptionBlock />
        <div className="grid gap-4 lg:grid-cols-2">
          <SourceCode />
          <TestSpace />
        </div>
      </div>
    </div>
  );
}
