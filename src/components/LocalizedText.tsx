'use client'

import { ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { languageFontClasses, type Language } from '@/lib/i18n'

interface LocalizedTextProps {
  children?: ReactNode
  className?: string
  lang?: string
  asChild?: boolean
}

/**
 * LocalizedText Component
 *
 * Ensures proper font rendering for all languages with automatic font selection.
 * Wraps content with the appropriate font class based on current language.
 *
 * @component
 * @example
 * // Basic usage
 * <LocalizedText>
 *   Your text content
 * </LocalizedText>
 *
 * @example
 * // With custom className
 * <LocalizedText className="text-lg font-bold">
 *   Heading text
 * </LocalizedText>
 */
export function LocalizedText({
  children,
  className = '',
  lang,
  asChild = false,
}: LocalizedTextProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} ${className}`.trim()

  if (asChild && typeof children === 'object' && children !== null) {
    return (
      <span className={contentClass}>
        {children}
      </span>
    )
  }

  return <span className={contentClass}>{children}</span>
}

/**
 * LocalizedHeading Component
 *
 * Semantic heading (h1-h6) with proper font handling for internationalization.
 * Automatically applies correct font family for current language.
 *
 * @component
 * @example
 * <LocalizedHeading level={1} className="text-3xl">
 *   Main Heading
 * </LocalizedHeading>
 */
interface LocalizedHeadingProps extends LocalizedTextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export function LocalizedHeading({
  level = 1,
  children,
  className = '',
  lang,
}: LocalizedHeadingProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  const contentClass = `${fontClass} ${className}`.trim()

  return (
    <HeadingTag className={contentClass}>
      {children}
    </HeadingTag>
  )
}

/**
 * LocalizedParagraph Component
 *
 * Semantic paragraph element with proper font handling for internationalization.
 * Best for longer text content with proper line spacing.
 *
 * @component
 * @example
 * <LocalizedParagraph className="text-base leading-relaxed">
 *   Lorem ipsum dolor sit amet...
 * </LocalizedParagraph>
 */
interface LocalizedParagraphProps extends LocalizedTextProps {
  leading?: 'tight' | 'normal' | 'relaxed' | 'loose'
}

export function LocalizedParagraph({
  children,
  className = '',
  lang,
  leading = 'normal',
}: LocalizedParagraphProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const leadingClasses = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }

  const contentClass = `${fontClass} ${leadingClasses[leading]} ${className}`.trim()

  return <p className={contentClass}>{children}</p>
}

/**
 * LocalizedLabel Component
 *
 * Semantic label element with proper font handling. Use for form labels.
 *
 * @component
 * @example
 * <LocalizedLabel htmlFor="email">
 *   Email Address
 * </LocalizedLabel>
 */
interface LocalizedLabelProps extends LocalizedTextProps {
  htmlFor?: string
}

export function LocalizedLabel({
  children,
  className = '',
  lang,
  htmlFor,
}: LocalizedLabelProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} block text-sm font-medium ${className}`.trim()

  return (
    <label htmlFor={htmlFor} className={contentClass}>
      {children}
    </label>
  )
}

/**
 * LocalizedButton Component
 *
 * Button element with proper font handling for text content.
 * Use for all button text to ensure consistent font rendering.
 *
 * @component
 * @example
 * <LocalizedButton className="px-4 py-2 bg-blue-500 text-white rounded">
 *   Click Me
 * </LocalizedButton>
 */
interface LocalizedButtonProps extends LocalizedTextProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function LocalizedButton({
  children,
  className = '',
  lang,
  onClick,
  type = 'button',
  disabled = false,
}: LocalizedButtonProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} ${className}`.trim()

  return (
    <button
      type={type}
      className={contentClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

/**
 * LocalizedSpan Component
 *
 * Utility component for inline localized text with consistent font rendering.
 * Use for small snippets within other elements.
 *
 * @component
 * @example
 * <p>
 *   Price: <LocalizedSpan>$19.99</LocalizedSpan>
 * </p>
 */
export function LocalizedSpan({
  children,
  className = '',
  lang,
}: LocalizedTextProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} ${className}`.trim()

  return <span className={contentClass}>{children}</span>
}

/**
 * LocalizedDiv Component
 *
 * Container wrapper ensuring proper font context for child elements.
 * Use as a section wrapper to enforce consistent font rendering for multiple items.
 *
 * @component
 * @example
 * <LocalizedDiv className="p-4">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </LocalizedDiv>
 */
interface LocalizedDivProps extends LocalizedTextProps {
  as?: 'div' | 'section' | 'article' | 'aside' | 'main'
}

export function LocalizedDiv({
  children,
  className = '',
  lang,
  as = 'div',
}: LocalizedDivProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} ${className}`.trim()
  const Component = as as any

  return <Component className={contentClass}>{children}</Component>
}

/**
 * LocalizedInput Component
 *
 * Input element with proper font handling for internationalized text input.
 * Use for all text input fields to support multiple language input.
 *
 * @component
 * @example
 * <LocalizedInput
 *   type="text"
 *   placeholder={t('enterName')}
 *   className="px-4 py-2 border rounded"
 * />
 */
interface LocalizedInputProps extends LocalizedTextProps {
  id?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
}

export function LocalizedInput({
  id,
  className = '',
  lang,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
}: LocalizedInputProps) {
  const { language } = useLanguage()
  const currentLang = (lang as Language) || language
  const fontClass = languageFontClasses[currentLang]

  const contentClass = `${fontClass} ${className}`.trim()

  return (
    <input
      id={id}
      type={type}
      className={contentClass}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  )
}

export default LocalizedText
