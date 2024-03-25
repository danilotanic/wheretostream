import Error from "~/components/error";
import Country from "~/components/table/country";
import TableHeader from "~/components/table/header";
import Option, { OptionUnavailable } from "~/components/table/option";
import ProviderComponent from "~/components/table/provider";
import ProvidersCarousel from "~/components/table/providersCarousel";
import {
  Provider,
  Country as CountryProps,
  Option as OptionProps,
} from "~/utils/api/rapidapi.types";

type CountryKey = keyof CountryProps;

export default function Providers({
  providers,
  selected: provider,
}: {
  providers: Provider[];
  selected?: string;
}) {
  if (providers.length === 0) return <Error />;

  const selected = providers.find(
    (p) => p.slug === (provider ?? providers?.[0]?.slug)
  );

  const keysToCheck: CountryKey[] = ["buy", "rent", "subscription"];
  const availableKeys: CountryKey[] = [];

  keysToCheck.forEach((key) => {
    if (selected?.countries.some((obj) => key in obj)) {
      availableKeys.push(key);
    }
  });

  return (
    <div className="w-full">
      <div className="max-w-xl mx-auto w-full">
        {providers.length <= 4 ? (
          <ul className="flex my-8 justify-center gap-2 items-center">
            {providers.map((provider) => (
              <ProviderComponent
                {...provider}
                key={provider.slug}
                selected={selected?.slug}
                className="w-[132px]"
              />
            ))}
          </ul>
        ) : null}

        {providers.length > 4 ? (
          <ProvidersCarousel selected={selected} providers={providers} />
        ) : null}
      </div>

      {selected?.countries && selected.countries.length > 0 ? (
        <>
          <TableHeader keys={availableKeys} />
          <ul className="max-w-3xl mx-auto">
            {selected.countries.map((country) => (
              <li
                key={country.code}
                className="transition-colors duration-300 hover:duration-100 py-1.5 rounded-lg hover:bg-neutral-100"
              >
                <div className="max-w-xl mx-auto flex items-center gap-4">
                  <Country {...country} />

                  {availableKeys.map((key) => {
                    const item = country[key] as OptionProps;

                    return (
                      <>
                        {item && item.link ? (
                          <Option key={`option-${key}`} to={item.link}>
                            {item?.price ? item?.price.formatted : "Stream"}
                          </Option>
                        ) : (
                          <OptionUnavailable key={`option-${key}`} />
                        )}
                      </>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Error />
      )}
    </div>
  );
}
