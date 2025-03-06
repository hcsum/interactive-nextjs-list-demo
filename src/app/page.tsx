import { getItems } from "@/actions/items";
import { getCategories } from "@/actions/category";
import "./styles.css";
import { ItemsProvider } from "@/components/Providers/ItemsProvider";
import ItemTable from "@/components/ItemTable";
import AddItemPanel from "@/components/AddItemPanel";
import CategoryPanel from "@/components/CategoryPanel";

const Dashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    createTempUser?: string;
  }>;
}) => {
  const { page = "1", search = "", category = "" } = await searchParams;
  const currentPage = Number(page);
  const { items, totalPages, total } = await getItems(
    currentPage,
    10,
    search,
    category,
  );
  const categories = await getCategories();

  return (
    <ItemsProvider items={items}>
      <div className="flex justify-center px-6 w-full pb-12 min-h-[120vh] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="w-full lg:max-w-[90%] mt-4 md:mt-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:w-2/3 order-2 lg:order-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Your Items ({total} items)
                </h2>
              </div>
              <ItemTable
                categories={categories}
                totalPages={totalPages}
                currentPage={currentPage}
                category={category}
                search={search}
              />
            </div>

            <div className="lg:w-1/3 order-1 lg:order-2 mb-8 lg:mb-32">
              <AddItemPanel categories={categories} />
              <CategoryPanel categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </ItemsProvider>
  );
};

export default Dashboard;
