import ModalWithChildren from "@/common/ModalWithChildren";

import { useProject } from "@/store/useProject";
import TicketContent from "./TicketContent";

const TicketModal = ({
  onUpdateDescription,
}: {
  onUpdateDescription?: (newDescription: string) => void;
}) => {
  const { selectedCard, setCardModalOpen } = useProject();

  if (!selectedCard) {
    setCardModalOpen(false);
    return null;
  }

  return (
    <ModalWithChildren
      onClose={() => {
        setCardModalOpen(false);
      }}
      size="large"
    >
      <TicketContent
        ticket={selectedCard}
        onUpdateDescription={onUpdateDescription}
      />
    </ModalWithChildren>
  );
};

export default TicketModal;
