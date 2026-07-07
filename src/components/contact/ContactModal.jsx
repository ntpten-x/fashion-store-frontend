import { SelectContact } from "../../services/apiContact"
import PropTypes from "prop-types"
import styled from "styled-components"

const Title = styled.h3`
  font-family: "Fredoka", sans-serif;
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 4px;
`;

const ContactCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-light);
    transform: translateX(2px);
  }
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: "Poppins", "Fredoka", sans-serif;
  width: 100%;

  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.88rem;
  background-color: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-muted);
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-color);
    border-color: var(--text-muted);
    color: var(--text-main);
  }
`;

const EmptyText = styled.p`
  font-size: 0.88rem;
  color: var(--text-muted);
  text-align: center;
  margin: 16px 0;
`;

const PLATFORMS = {
  facebook: { label: "📘 Facebook" },
  instagram: { label: "📸 Instagram" },
  line: { label: "💬 Line" },
  phone: { label: "📞 เบอร์โทร" },
  other: { label: "🔗 ช่องทางอื่น" }
};

export default function ContactModal({ onClose }) {
  const { data: contacts, isLoading: isFetching } = SelectContact();

  const getPlatformLink = (platform, val) => {
    if (platform === "phone") return `tel:${val}`;
    if (platform === "line" && !val.startsWith("http")) return `https://line.me/R/ti/p/~${val}`;
    if (val.startsWith("http") || val.startsWith("https")) return val;
    return `https://${val}`;
  };

  return (
    <div>
      <Title>📞 ช่องทางการติดต่อเรา</Title>

      {isFetching ? (
        <EmptyText>กำลังโหลดข้อมูล... 🌸</EmptyText>
      ) : !contacts || contacts.length === 0 ? (
        <EmptyText>ยังไม่มีช่องทางการติดต่อในขณะนี้ 🥺</EmptyText>
      ) : (
        <ContactList>
          {contacts.map((contact) => (
            <ContactCard key={contact.id}>
              <ContactLink
                href={getPlatformLink(contact.platform, contact.value)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{PLATFORMS[contact.platform]?.label.split(" ")[0]}</span>
                <span>
                  <strong>{PLATFORMS[contact.platform]?.label.split(" ")[1]}:</strong> {contact.value}
                </span>
              </ContactLink>
            </ContactCard>
          ))}
        </ContactList>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <CancelButton onClick={onClose} style={{ width: '100%' }}>
          ❌ ปิดหน้าต่าง
        </CancelButton>
      </div>
    </div>
  );
}

ContactModal.propTypes = {
  onClose: PropTypes.func.isRequired
};
