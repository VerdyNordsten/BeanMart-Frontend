import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

interface OrderNotesFormProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function OrderNotesForm({ notes, onNotesChange }: OrderNotesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Notes</CardTitle>
        <CardDescription>
          Any special instructions for your order?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Special delivery instructions, gift message, etc."
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
