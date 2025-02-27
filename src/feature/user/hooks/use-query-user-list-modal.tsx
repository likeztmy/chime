import { parseAsBoolean, useQueryState } from "nuqs";

export const useQueryUserListModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "query-users",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
