import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockPortfolio } from '@/lib/mock-data';

export function PortfolioOverview() {
  const totalValue = mockPortfolio.reduce((acc, investment) => acc + investment.currentValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Holdings</CardTitle>
        <CardDescription>An overview of your current investments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPortfolio.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">{investment.name}</TableCell>
                <TableCell>{investment.symbol}</TableCell>
                <TableCell className="text-right">{investment.quantity}</TableCell>
                <TableCell className="text-right">${investment.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="font-bold text-lg justify-end">
        Total Value: ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </CardFooter>
    </Card>
  );
}
