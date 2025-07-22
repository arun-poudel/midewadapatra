import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function DaoCard() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative">
        <Image
          src="/images/rupandehi.png"
          alt="District Administration Office Rupandehi building"
          width={400}
          height={600}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 flex items-center justify-center">
          <h2 className="text-xl font-semibold text-center">DAO rupandehi</h2>
        </div>
      </div>
    </Card>
  )
}
