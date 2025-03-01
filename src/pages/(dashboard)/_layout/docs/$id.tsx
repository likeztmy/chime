import { createFileRoute, useParams } from "@tanstack/react-router";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { Editor } from "@/feature/docs/components/editor";
import { JoinDocModal } from "@/feature/docs/components/JoinDocModal";
import { request } from "@/lib/request";
import { useEffect, useState } from "react";
// import { request } from "@/lib/request";

export const Route = createFileRoute("/(dashboard)/_layout/docs/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [content, setContent] = useState<string | undefined>(undefined);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const res = await request.get(`/docs?id=${id}`);
      const { docs } = res;

      if (!docs?.[0]?.content) {
        setShowJoinModal(true);
        return;
      }

      setContent(docs[0].content);
    };
    fetchContent();
  }, []);

  return (
    <>
      <JoinDocModal open={showJoinModal} onOpenChange={setShowJoinModal} />
      <LiveblocksProvider
        authEndpoint={async () => {
          const res = await request.get("/docs/token");
          const { token } = res;
          return { token };
        }}
        throttle={16}
      >
        <RoomProvider id={id}>
          <ClientSideSuspense
            fallback={
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    正在加载文档...
                  </p>
                </div>
              </div>
            }
          >
            <Editor initialContent={content} />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </>
  );
}
