'use client'

import React, { useEffect, useState } from 'react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './RevelBlocks.module.css'

export type MediaValue = { imageId?: string; imageUrl?: string; alt: string }

export type RevelHeroProps = MediaValue & {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export type MembershipRatesProps = {
  heading: string
  description: string
  price: string
  inclusions: { text: string }[]
  buttonLabel: string
  buttonHref: string
  images: MediaValue[]
}

export type ResidentTestimonialsProps = {
  heading: string
  rating: number
  reviewCount: number
  testimonials: { quote: string; author: string }[]
}

export type FloorPlansProps = {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
  images: MediaValue[]
}

export type LifestylePillarsProps = {
  heading: string
  description: string
  pillars: (MediaValue & { title: string; description: string })[]
}

export type CulinaryFeatureProps = {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
  images: MediaValue[]
}

export type AmenitiesGridProps = {
  heading: string
  description: string
  amenities: (MediaValue & { name: string })[]
}

export type CommunityGalleryProps = {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
  images: MediaValue[]
}

export type TourCTAProps = MediaValue & {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
}

export type FAQAccordionProps = {
  heading: string
  items: { question: string; answer: string }[]
}

type ResolvedMedia = { imageId?: string; url: string }

function useMediaSrc({ imageId, imageUrl }: MediaValue) {
  const [resolved, setResolved] = useState<ResolvedMedia>({ url: '' })

  useEffect(() => {
    if (!imageId || imageUrl) return
    let cancelled = false
    fetch(`/api/media/${imageId}`)
      .then((response) => response.json())
      .then((data) => {
        const media = data.doc ?? data
        const url = media.url || (media.filename ? `/api/media/file/${media.filename}` : '')
        if (!cancelled) setResolved({ imageId, url })
      })
      .catch(() => {
        if (!cancelled) setResolved({ imageId, url: '' })
      })
    return () => {
      cancelled = true
    }
  }, [imageId, imageUrl])

  return imageUrl || (resolved.imageId === imageId ? resolved.url : '')
}

function Img({ media, className }: { media: MediaValue; className?: string }) {
  const src = useMediaSrc(media)
  if (!src) {
    return (
      <div className={`${styles.placeholder} ${className ?? ''}`}>
        <span className={styles.placeholderLabel}>{media.alt || 'Add image'}</span>
      </div>
    )
  }
  return <img src={src} alt={media.alt} className={className} />
}

export function RevelHero({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  ...media
}: RevelHeroProps) {
  const src = useMediaSrc(media)
  return (
    <section
      className={styles.hero}
      style={
        src
          ? { backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      <div className={styles.heroOverlay} />
      <div className={styles.heroInner}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.heroTitle}>{title}</h1>
        {description && <div className={styles.heroDescription}>{description}</div>}
        <div className={styles.buttonRow}>
          {primaryLabel && (
            <a href={primaryHref} className={styles.btnPrimary}>
              {primaryLabel}
            </a>
          )}
          {secondaryLabel && (
            <a href={secondaryHref} className={styles.btnSecondary}>
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export function MembershipRates({
  heading,
  description,
  price,
  inclusions,
  buttonLabel,
  buttonHref,
  images,
}: MembershipRatesProps) {
  const list = images ?? []
  return (
    <section className={`${styles.section} ${styles.membershipSection}`}>
      <div className={`${styles.wrap} ${styles.membershipGrid}`}>
        <div className={styles.membershipSlideshow}>
          <Swiper
            className={styles.membershipSwiper}
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={list.length > 1}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation
            pagination={{ clickable: true }}
            aria-label="Revel Eagle membership images"
          >
            {list.map((media, index) => (
              <SwiperSlide key={`${media.imageId ?? media.imageUrl ?? media.alt}-${index}`}>
                <div className={styles.membershipSlide}>
                  <Img media={media} className={styles.membershipSlideImage} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.membershipBody}>
          <h2 className={styles.heading}>{heading}</h2>
          {description && <div className={styles.description}>{description}</div>}
          {price && (
            <p className={styles.price}>
              From <strong>{price}</strong> / month
            </p>
          )}
          <ul className={styles.inclusionList}>
            {(inclusions ?? []).map((item, i) => (
              <li key={i}>{item.text}</li>
            ))}
          </ul>
          {buttonLabel && (
            <a href={buttonHref} className={styles.btnPrimary}>
              {buttonLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export function ResidentTestimonials({ heading, rating, reviewCount, testimonials }: ResidentTestimonialsProps) {
  const list = testimonials ?? []
  const ratingPercent = `${Math.max(0, Math.min(5, rating)) * 20}%`

  return (
    <section className={`${styles.section} ${styles.testimonialsSection}`}>
      <div className={`${styles.wrap} ${styles.testimonialsWrap}`}>
        <img
          className={styles.quoteIcon}
          src="https://revelcommunities.com/wp-content/uploads/2022/11/qout-icon.png"
          width={101}
          height={64}
          alt=""
        />
        <h2 className={`${styles.heading} ${styles.center}`}>{heading}</h2>
        <Swiper
          className={styles.testimonialSwiper}
          modules={[Autoplay, Navigation]}
          loop={list.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
          navigation
          aria-label="Resident testimonials"
        >
          {list.map((t, i) => (
            <SwiperSlide key={i}>
              <blockquote className={styles.testimonialCard}>
                <div className={styles.quote}>{t.quote}</div>
                <cite className={styles.author}>{t.author}</cite>
              </blockquote>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.ratingSummary} aria-label={`${rating} out of 5 from ${reviewCount} reviews`}>
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.ratingStars} aria-hidden="true">
            <span className={styles.ratingStarsEmpty}>★★★★★</span>
            <span className={styles.ratingStarsFilled} style={{ width: ratingPercent }}>
              ★★★★★
            </span>
          </span>
          <span className={styles.reviewCount}>/ {reviewCount} Reviews</span>
        </div>
      </div>
    </section>
  )
}

export function FloorPlans({
  heading,
  description,
  buttonLabel,
  buttonHref,
  images,
}: FloorPlansProps) {
  const list = images ?? []

  return (
    <section className={`${styles.section} ${styles.floorPlansSection}`}>
      <div className={`${styles.wrap} ${styles.floorPlansWrap}`}>
        <div className={styles.floorPlansBody}>
          <h2 className={`${styles.heading} ${styles.center}`}>{heading}</h2>
          {description && <div className={`${styles.description} ${styles.centerText}`}>{description}</div>}
        </div>
        {buttonLabel && (
          <div className={styles.floorPlansButtonRow}>
            <a href={buttonHref} className={styles.floorPlansButton}>
              {buttonLabel}
            </a>
          </div>
        )}
        <div className={styles.floorPlansSlideshow}>
          <Swiper
            className={styles.floorPlansSwiper}
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={list.length > 1}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation
            pagination={{ clickable: true }}
            aria-label="Revel Eagle floor plans"
          >
            {list.map((media, index) => (
              <SwiperSlide key={`${media.imageId ?? media.imageUrl ?? media.alt}-${index}`}>
                <div className={styles.floorPlansSlide}>
                  <Img media={media} className={styles.floorPlansSlideImage} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export function LifestylePillars({ heading, description, pillars }: LifestylePillarsProps) {
  return (
    <section className={`${styles.section} ${styles.lifestyleSection}`}>
      <div className={`${styles.wrap} ${styles.lifestyleWrap}`}>
        <h2 className={`${styles.heading} ${styles.center}`}>{heading}</h2>
        {description && <div className={`${styles.description} ${styles.centerText}`}>{description}</div>}
        <div className={styles.pillarGrid}>
          {(pillars ?? []).map((pillar, i) => (
            <div key={i} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Img media={pillar} className={styles.pillarImage} />
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CulinaryFeature({
  heading,
  description,
  buttonLabel,
  buttonHref,
  images,
}: CulinaryFeatureProps) {
  const list = images ?? []

  return (
    <section className={styles.culinarySection}>
      <div className={styles.culinaryGrid}>
        <div className={styles.culinaryBody}>
          <h2 className={styles.culinaryHeading}>{heading}</h2>
          {description && <div className={styles.culinaryDescription}>{description}</div>}
          {buttonLabel && (
            <a href={buttonHref} className={styles.culinaryButton}>
              {buttonLabel}
            </a>
          )}
        </div>
        <div className={styles.culinarySlideshow}>
          <Swiper
            className={styles.culinarySwiper}
            modules={[Autoplay]}
            loop={list.length > 1}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            aria-label="Revel Eagle culinary images"
          >
            {list.map((media, index) => (
              <SwiperSlide key={`${media.imageId ?? media.imageUrl ?? media.alt}-${index}`}>
                <Img media={media} className={styles.culinaryImage} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export function AmenitiesGrid({ heading, description, amenities }: AmenitiesGridProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const list = amenities ?? []
  const activeAmenity = list[activeIndex] ?? list[0]

  return (
    <section className={`${styles.section} ${styles.amenitiesSection}`}>
      <div className={`${styles.wrap} ${styles.amenitiesWrap}`}>
        <h2 className={`${styles.heading} ${styles.center}`}>{heading}</h2>
        {description && <div className={`${styles.description} ${styles.centerText}`}>{description}</div>}
        <div className={styles.amenityTabs} role="tablist" aria-label="Amenities">
          {list.map((amenity, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`${styles.amenityTab} ${i === activeIndex ? styles.amenityTabActive : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {amenity.name}
            </button>
          ))}
        </div>
        {activeAmenity && (
          <div className={styles.amenityFeature} role="tabpanel">
            <Img media={activeAmenity} className={styles.amenityFeatureImage} />
          </div>
        )}
      </div>
    </section>
  )
}

export function CommunityGallery({
  heading,
  description,
  buttonLabel,
  buttonHref,
  images,
}: CommunityGalleryProps) {
  return (
    <section className={`${styles.section} ${styles.gallerySection}`}>
      <div className={styles.wrap}>
        <div className={styles.galleryHeader}>
          <div>
            <h2 className={styles.heading}>{heading}</h2>
            {description && <div className={styles.description}>{description}</div>}
          </div>
          {buttonLabel && (
            <a href={buttonHref} className={styles.btnOutline}>
              {buttonLabel}
            </a>
          )}
        </div>
        <div className={styles.galleryGrid}>
          {(images ?? []).map((media, i) => (
            <Img key={i} media={media} className={styles.galleryImage} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function TourCTA({ heading, description, buttonLabel, ...media }: TourCTAProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className={`${styles.section} ${styles.cta}`}>
      <div className={`${styles.wrap} ${styles.ctaGrid}`}>
        <div className={styles.ctaMedia}>
          <Img media={media} className={styles.ctaImage} />
        </div>
        <div className={styles.ctaBody}>
          <h2 className={styles.heading}>{heading}</h2>
          {description && <div className={styles.description}>{description}</div>}
          {submitted ? (
            <p className={styles.formSuccess} role="status">
              Thank you. We’ll be in touch soon to schedule your visit.
            </p>
          ) : (
            <form className={styles.tourForm} onSubmit={handleSubmit}>
              <label className={styles.formField}>
                <span>First Name</span>
                <input name="firstName" type="text" autoComplete="given-name" required />
              </label>
              <label className={styles.formField}>
                <span>Last Name</span>
                <input name="lastName" type="text" autoComplete="family-name" required />
              </label>
              <label className={styles.formField}>
                <span>Email Address</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label className={styles.formField}>
                <span>Phone Number</span>
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label className={styles.formField}>
                <span>Are you looking for yourself or someone you know?</span>
                <select name="inquiring_for" defaultValue="Myself">
                  <option value="Myself">Myself</option>
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className={styles.formField}>
                <span>Tell Us More!</span>
                <textarea name="question" rows={4} />
              </label>
              <button type="submit" className={styles.tourFormButton}>
                {buttonLabel || 'SUBMIT'}
              </button>
              <span className={styles.formPrivacy}>
                By entering your phone number, you agree to Revel Eagle contacting you via SMS/text message and email in response to inquiries. Message frequency varies and message and data rates may apply. Text HELP for help. Text STOP to unsubscribe.
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export function FAQAccordion({ heading, items }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const accordionId = React.useId()

  return (
    <section className={`${styles.section} ${styles.faqSection}`}>
      <div className={`${styles.wrap} ${styles.faqWrap}`}>
        <h2 className={`${styles.heading} ${styles.center}`}>{heading}</h2>
        <div className={styles.faqList}>
          {(items ?? []).map((item, i) => {
            const isOpen = activeIndex === i
            const answerId = `faq-answer-${accordionId}-${i}`

            return (
              <div key={i} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                >
                  <span className={styles.faqIcon} aria-hidden="true">
                    <svg viewBox="0 0 448 512" focusable="false">
                      {isOpen ? (
                        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                      ) : (
                        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                      )}
                    </svg>
                  </span>
                  <span className={styles.faqQuestionText}>{item.question}</span>
                </button>
                <div
                  id={answerId}
                  className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                  role="region"
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className={styles.faqAnswerInner}>
                    <div className={styles.faqAnswerContent}>{item.answer}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
