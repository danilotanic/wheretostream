import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import Provider from "~/components/table/provider";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { cn } from "~/utils";
import { Provider as ProviderProps } from "~/utils/api/rapidapi.types";

export default function ProvidersCarousel({
  providers,
  selected,
}: {
  providers: ProviderProps[];
  selected?: ProviderProps;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [drag, setDrag] = useState(false);
  const scaleLeft = useMotionValue(0);
  const scaleRight = useMotionValue(0);

  const startIndex = providers.findIndex((p) => p.slug === selected?.slug);
  const moreThanFour = providers.length > 4;

  const onSlidesInView = useCallback(
    (api: CarouselApi) => {
      scaleLeft.set(api.scrollProgress());
      scaleRight.set(1 - api.scrollProgress());
    },
    [scaleLeft, scaleRight]
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    // make sure it initializes the gradient on first render
    onSlidesInView(api);

    api.on("scroll", onSlidesInView);
    api.on("pointerDown", () => setDrag(true));
    api.on("pointerUp", () => setDrag(false));
  }, [api, onSlidesInView]);

  return (
    <Carousel
      setApi={setApi}
      className="my-8"
      opts={{ align: "center", dragFree: true, startIndex }}
    >
      <CarouselContent
        className={cn(moreThanFour ? "justify-normal" : "sm:justify-center")}
      >
        {providers.map((provider) => (
          <CarouselItem
            key={provider.slug}
            className={cn("basis-auto sm:basis-1/4")}
          >
            <Provider
              {...provider}
              selected={selected?.slug}
              className={cn(moreThanFour ? "cursor-grab" : "!cursor-pointer", {
                "cursor-grabbing": drag,
              })}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="block sm:hidden">
        <motion.div
          style={{ scaleX: scaleLeft, originX: 0 }}
          className="absolute pointer-events-none inset-y-0 w-20 md:w-40 from-white to-white/0 bg-gradient-to-r"
        />
        <motion.div
          style={{ scaleX: scaleRight, originX: "100%" }}
          className="absolute pointer-events-none inset-y-0 right-0 w-20 md:w-40 from-white to-white/0 bg-gradient-to-l"
        />
      </div>
      <div className={cn("hidden", moreThanFour ? "md:block" : "")}>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
