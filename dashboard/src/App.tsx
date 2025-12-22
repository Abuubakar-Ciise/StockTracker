import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>shadcn/ui works 🚀</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This card and button come from shadcn/ui.
          </p>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  );
}
