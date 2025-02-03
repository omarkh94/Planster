import ModalWithChildren from "@/common/ModalWithChildren";

import { useProject } from "@/store/useProject";
import CardContent from "./CardContent";

const CardModal = ({
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
      <CardContent
        card={selectedCard}
        onUpdateDescription={onUpdateDescription}
      />
    </ModalWithChildren>
  );
};

export default CardModal;
