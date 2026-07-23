import TicketConversation from "@/components/ticket-conversation"

export default function AdminTicketDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Ticket Detail</h1>
      <TicketConversation ticketId={params.id} isAdmin />
    </div>
  )
}
