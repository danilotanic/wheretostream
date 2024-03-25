import { Link } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";
import Error from "~/components/error";
import Country from "~/components/table/country";
import TableHeader from "~/components/table/header";
import Option, { OptionUnavailable } from "~/components/table/option";
import ProviderComponent from "~/components/table/provider";
import ProvidersCarousel from "~/components/table/providersCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Country as CountryProps,
  Option as OptionProps,
  Provider,
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
          <Accordion type="single" collapsible className="sm:hidden">
            {selected.countries.map((country) => (
              <AccordionItem key={country.code} value={country.code}>
                <AccordionTrigger>
                  <Country {...country} />
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {availableKeys.map((key) => {
                      const item = country[key] as OptionProps;
                      return (
                        <li
                          className="flex items-center mb-1"
                          key={`option-${key}`}
                        >
                          {item && item.link ? (
                            <Link
                              to={item.link}
                              className="flex-1 flex items-center"
                            >
                              <div className="capitalize flex-1">{key}</div>
                              <Option to={item.link}>
                                {item?.price ? item?.price.formatted : "Stream"}
                              </Option>
                            </Link>
                          ) : (
                            <>
                              <div className="flex-1 capitalize">{key}</div>
                              <OptionUnavailable key={`option-${key}`} />
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="hidden sm:block">
            <TableHeader keys={availableKeys} />
            <ul className="max-w-3xl mx-auto">
              {selected.countries.map((country) => (
                <li
                  key={country.code}
                  className="transition-colors duration-300 hover:duration-100 py-1.5 rounded-lg hover:bg-neutral-100"
                >
                  <div className="max-w-xl mx-auto flex items-center gap-1">
                    <Country {...country} />
                    <div className="flex items-center gap-1">
                      {availableKeys.map((key) => {
                        const item = country[key] as OptionProps;
                        return (
                          <Fragment key={`option-${key}`}>
                            {item && item.link ? (
                              <Option to={item.link}>
                                {item?.price ? item?.price.formatted : "Stream"}
                              </Option>
                            ) : (
                              <OptionUnavailable key={`option-${key}`} />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Error />
      )}
    </div>
  );
}
