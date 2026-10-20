import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { images, pilgrimagePackages, sacredOffers } from "../data/purePath";
import type { ScreenProps } from "../types";
import { CustomPackageChat } from "../components/CustomPackageChat";
import {
  LinkLikeButton,
  OfferCard,
  PackageCard,
} from "../components/PurePathCards";
import {
  PageHero,
  ScreenScroll,
  Section,
  SectionHeading,
} from "../components/ui";

export function PackagesScreen({ onNavigate }: ScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [offersY, setOffersY] = useState(0);

  function scrollToOffers() {
    if (!offersY) {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(offersY - 12, 0),
      animated: true,
    });
  }

  return (
    <ScreenScroll ref={scrollRef} className="bg-pure-softBg">
      <PageHero
        image={images.hero}
        title="Packages"
        body="Discover flexible Hajj and Umrah packages tailored to your needs. Pure Path supports every step of your pilgrimage with care and expertise."
      />

      <Section tone="paper">
        <SectionHeading
          eyebrow="Custom Package"
          title="Build Your Own Package with AI"
          body="Chat about your dates, budget, group, and hotel preferences, and get a package designed around you."
        />
        <CustomPackageChat />
      </Section>

      <Section tone="soft" compact>
        <View className="gap-[18px]">
          {pilgrimagePackages.map((item) => (
            <PackageCard
              key={item.slug}
              item={item}
              onDetails={scrollToOffers}
            />
          ))}
        </View>
      </Section>

      <View onLayout={(event) => setOffersY(event.nativeEvent.layout.y)}>
        <Section tone="white">
          <SectionHeading
            eyebrow="Special Savings"
            title="Limited Time Sacred Journey Offers"
            body="Enjoy trusted services, premium accommodations, and valuable savings for a spiritually fulfilling experience."
          />
          <LinkLikeButton
            label="View All Offers ->"
            onPress={() => onNavigate("home")}
          />
          <View className="gap-4">
            {sacredOffers.map((offer) => (
              <OfferCard
                key={offer.title}
                title={offer.title}
                discount={offer.discount}
                description={offer.description}
                image={offer.image}
                onPress={() => onNavigate("home")}
              />
            ))}
          </View>
        </Section>
      </View>
    </ScreenScroll>
  );
}