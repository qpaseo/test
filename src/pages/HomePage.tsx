import { Server, Cloud, Database, Flame, Zap } from "lucide-react";
import CalculatorCard from "../components/CalculatorCard";

const HomePage = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="mb-4 mt-8 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          클라우드 개발 비용 계산기
        </h1>

        <p className="mx-auto max-w-3xl text-lg text-gray-500">
          AWS, Azure, Google Cloud Platform, Fierbase 의 예상 개발 비용을 쉽고
          빠르게 계산해보세요.
        </p>
        <p className="mx-auto max-w-3xl text-sm text-gray-500">
          (단 무료단위의 계산은 지원하지 않습니다)
        </p>
      </section>

      <section className="mx-auto max-w-5xl py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <CalculatorCard
            title="AWS"
            description="Amazon EC2, EBS, ELB 등 AWS 등의 서비스의 예상 비용을 계산해보세요."
            icon={<Cloud className="h-8 w-8 text-orange-500" />}
            path="/aws"
            className="aws-card"
          />
          <CalculatorCard
            title="Azure"
            description="App Service, Microsoft Azure 등의 서비스의 예상 비용을 계산해보세요."
            icon={
              <div className="flex h-8 w-8 items-center justify-center text-blue-600 font-bold text-3xl">
                A
              </div>
            }
            path="/azure"
            className="azure-card"
          />
          <CalculatorCard
            title="Google Cloud"
            description="Compute Engine, Cloud Storage 등의 GCP 서비스의 예상 비용을 계산해보세요."
            icon={<Database className="h-8 w-8 text-red-500" />}
            path="/gcp"
            className="gcp-card"
          />

          <CalculatorCard
            title="Firebase"
            description="Firebase에서 지원하는 서비스의 예상 비용을 계산해보세요."
            icon={<Flame className="h-8 w-8 text-red-500" />}
            path="/firebase"
            className="firebase-card"
          />

          <CalculatorCard
            title="Supabase"
            description="Supabase에서 지원하는 서비스의 예상 비용을 계산해보세요."
            icon={<Zap className="h-8 w-8 text-green-500" />}
            path="/supabase"
            className="supabase-card"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
